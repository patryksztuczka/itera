# Feature: Flashcard System

## Overview

A core pillar of the system designed for long-term retention of foundational facts and concepts using Spaced Repetition.

## Organization (Hierarchy)

To support deep learning of complex topics, the system uses a nested folder structure:

- **Catalog:** A folder-like container that can hold sub-catalogs or decks. This allows for deep categorization (e.g., `Computer Science > Linux > Kernel > Memory Management`).
- **Deck:** A specific collection of flashcards. Decks are the unit of study.

## Card Mechanics

- **Type:** Simple Front/Back cards.
- **Content:** Full Markdown support for both sides (allows for code blocks, LaTeX, and rich formatting).
- **Study Mode:**
  - User views the **Front**.
  - User mentally or physically recalls the answer.
  - User flips to the **Back**.
  - User self-evaluates based on the FSRS scale.

## Scheduling Algorithm

We use the **FSRS (Free Spaced Repetition Scheduler)**.

- **Inputs:**
  - `Again`: Forgot the card completely.
  - `Hard`: Recalled with significant effort.
  - `Good`: Recalled with normal effort.
  - `Easy`: Recalled instantly.
- **Goal:** To maintain a specific "retrievability" target (defaulting to 90%) while minimizing the number of reviews required over time.
