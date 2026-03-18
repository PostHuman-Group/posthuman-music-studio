import React from 'react';
import { BroadcastEngine } from './BroadcastEngine';
import { MetadataEngine } from './MetadataEngine';
import { BridgeScheduler } from './BridgeScheduler';
import { ControlHub } from './ControlHub';
import { motion } from 'framer-motion';

/**
 * Stream Module Main Entry Point
 * Consolidates the operational backbone of PostHuman Music: Studio.
 */

export const StreamModule: React.FC = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
            {/* Left Column: Operations & Planning (7/12) */}
            <div className="xl:col-span-7 flex flex-col gap-6">
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ControlHub />
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <MetadataEngine genre="PostHuman Ambient" />
                </motion.section>
            </div>

            {/* Right Column: Broadcast & Logistics (5/12) */}
            <div className="xl:col-span-5 flex flex-col gap-6">
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <BroadcastEngine />
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex-1 min-h-[400px]"
                >
                    <BridgeScheduler />
                </motion.section>
            </div>
        </div>
    );
};

export default StreamModule;
