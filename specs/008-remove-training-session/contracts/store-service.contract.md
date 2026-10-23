# Contract: State Store & Service Interfaces

**Feature Branch**: `008-remove-training-session`  
**Date**: 2026-10-22  
**Contract ID**: `CONTRACT-STORE-001`  

---

## 1. Zustand Store Files

### Active Stores
- `src/store/ClubStore.ts`
- `src/store/PlayerStore.ts`
- `src/store/GameStore.ts`
- `src/store/MenuStore.ts`
- `src/features/play-match/store/usePlayMatchStore.ts`

### Prohibited Stores
- `src/store/TrainingStore.ts` MUST be deleted. No training state hook may exist.

---

## 2. Store Contract Types (`src/types/store.ts`)

### Prohibited Types
The module MUST NOT export:
- `TrainingState`

---

## 3. Database Access Hook (`src/hooks/useDB.ts`)

### Required Controllers
- `TeamController`
- `PlayerController`
- `GameController`
- `PlayerStatsController`

### Prohibited Controllers
The return object of `useDB()` MUST NOT include:
- `TrainingController`
- `TraningPlayersController`
- `TrainingPlayersController`
