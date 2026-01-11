// components/AIWrapper.tsx
import React from 'react';

interface AIWrapperProps {
    children: React.ReactNode;
    view: string;
}

const AIWrapper: React.FC<AIWrapperProps> = ({ children, view }) => {
    // This is a pass-through wrapper for now.
    // In the future, it could connect to an AI context to provide module-specific AI features.
    return <>{children}</>;
};

export default AIWrapper;
