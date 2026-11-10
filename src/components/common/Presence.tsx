import React from 'react';
import { AnimatePresence } from 'framer-motion';

export const Presence = AnimatePresence as unknown as React.FC<{ children?: React.ReactNode }>;