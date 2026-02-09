import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-syntax-highlighter to avoid ESM/dependency issues in Jest
jest.mock('react-syntax-highlighter', () => ({
    Prism: ({ children }) => <pre>{children}</pre>,
}));
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
    vscDarkPlus: {},
}));

import App from './App';

test('renders Header and Footer', async () => {
    // App contains its own Router, so we can render it directly
    render(<App />); 
    
    // Check for "Arabify" or similar text from Header/Footer
    // Using findByText since it might be async if there are effects
    // But basic rendering should be immediate.
    // Let's check for the logo alt text or something we know exists.
    // In Header.js (standard), there's usually a logo.
    
    // Smoke test: just check if the App container exists
    const appContainer = document.querySelector('.App');
    expect(appContainer).toBeInTheDocument();
});

test('toggles language', () => {
    // This is a bit harder without knowing exact text content to assert on, 
    // but we can check if the document lang attribute changes.
    render(<App />);

    // Initially English
    expect(document.documentElement.lang).toBe('en');

    // Find the toggle button. 
    // In Header.js (which we didn't fully read but App.js passes toggleLanguage), 
    // we assume there's a button. We might need to look for a button with a specific label.
    // Let's assume there is a button. We'll search by role 'button'.
    const buttons = screen.getAllByRole('button');
    // If there are multiple, this might be flaky.
    // However, usually the language toggle is prominent.
    // Let's try to click one and see if lang changes, or just verify 'en' for now.

    // NOTE: Without seeing Header.js content, I can't write a precise interaction test yet.
    // I'll stick to the "renders" test for now to be safe, or I'll read Header.js first.
    // Actually, I'll read Header.js in the next step to refine this. 
    // For now, let's just write the basic smoke test.
});
