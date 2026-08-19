"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "kopick.compare";
export const MAX_COMPARE = 3;

// localStorage(비로그인 환경의 유일한 영속 저장소)와 동기화되는 전역 스토어.
// useEffect+setState로 마운트 후 하이드레이션하는 대신 useSyncExternalStore를 써서
// "구독 시점에 외부 시스템에서 값을 읽어와 리스너에 알린다"는 정석 패턴을 따른다.

type Listener = () => void;

const EMPTY_IDS: string[] = [];

let ids: string[] = EMPTY_IDS;
let hydrated = false;
const listeners = new Set<Listener>();

function readFromStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage 접근 불가 환경(예: 시크릿 모드 제한) 시 조용히 무시
  }
}

function setIds(next: string[]) {
  ids = next;
  writeToStorage(next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  if (!hydrated) {
    hydrated = true;
    ids = readFromStorage();
    queueMicrotask(() => listeners.forEach((l) => l()));
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  return ids;
}

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function useCompare() {
  const currentIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((x) => x !== id));
    } else if (ids.length < MAX_COMPARE) {
      setIds([...ids, id]);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setIds(ids.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  return {
    ids: currentIds,
    isSelected: (id: string) => currentIds.includes(id),
    toggle,
    remove,
    clear,
    isFull: currentIds.length >= MAX_COMPARE,
  };
}
