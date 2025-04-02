# README.md Plan for Metacognition Trainer

## 1. Project Title
`Metacognition Trainer: Mastermind or Monster?`

## 2. Description
A brief overview explaining that this is a web-based application built with Vue.js designed to help users practice and develop metacognitive skills, inspired by concepts of self-awareness, emotional intelligence, and strategic thinking. Mention the "Mastermind vs. Monster" dichotomy explored.

## 3. Key Features
*   Interactive modules covering various metacognition techniques.
*   Emotional Labeling exercises.
*   Thought Tracking journal with analysis prompts.
*   Strategic Observation scenario simulator.
*   Mastery Techniques practice section.
*   Progress tracking (score and mastery level).
*   Exploration of the potential "Dark Side" of metacognition (manipulation tactics).
*   Data persistence using browser Local Storage.
*   Data import/export functionality (.json).

## 4. Technology Stack
*   HTML5
*   CSS3 (with CSS Variables for theming)
*   JavaScript (ES6+)
*   Vue.js 3 (via CDN)

## 5. How to Use
*   Simply open the `index.html` file in a modern web browser.
*   No build process or server required.

## 6. Modules Overview
*   **Introduction:** Explains Level 1 vs. Level 2 thinking.
*   **Emotional Labeling:** Practice identifying and understanding emotions.
*   **Thought Tracking:** Log, categorize, and analyze thoughts.
*   **Strategic Observation:** Learn to observe social dynamics and micro-reactions through scenarios.
*   **Mastery Techniques:** Practice specific techniques like third-person self-talk.
*   **Progress:** View score, mastery level, and progress percentage.
*   **The Dark Side:** Learn to recognize manipulative tactics using metacognitive skills.
*   **Data Import/Export:** Manage application data (score, journal entries).

## 7. Data Persistence
Explain that progress (score, journal entries, practice logs) is saved automatically in the browser's Local Storage. Clearing browser data will erase progress unless exported.

## 8. Data Management
Detail how users can export their data to a JSON file for backup and import it later to restore their state. Warn about overwriting existing data on import.

## 9. (Optional) Source/Inspiration
Mention if the concepts are based on a specific video, transcript, or philosophy (the code includes quotes that suggest a source).

## 10. Module Diagram

```mermaid
graph TD
    A[Metacognition Trainer] --> B(Introduction);
    A --> C(Emotional Labeling);
    A --> D(Thought Tracking);
    A --> E(Strategic Observation);
    A --> F(Mastery Techniques);
    A --> G(Progress);
    A --> H(The Dark Side);
    A --> I(Data Import/Export);

    C --> G;
    D --> G;
    E --> G;
    F --> G;

    style A fill:#1a1a1d,stroke:#4caf50,stroke-width:2px,color:#f0f0f5
    style B fill:#2a2a2f,stroke:#555,color:#f0f0f5
    style C fill:#2a2a2f,stroke:#555,color:#f0f0f5
    style D fill:#2a2a2f,stroke:#555,color:#f0f0f5
    style E fill:#2a2a2f,stroke:#555,color:#f0f0f5
    style F fill:#2a2a2f,stroke:#555,color:#f0f0f5
    style G fill:#3a3a40,stroke:#4caf50,color:#f0f0f5
    style H fill:#2a2a2f,stroke:#f44336,color:#f0f0f5
    style I fill:#3a3a40,stroke:#64b5f6,color:#f0f0f5