import React from 'react'
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion'

const Output = ({ colorType, colorValue, isCopied, onCopy }) => {
    return (
    <>
        {colorType.toUpperCase()}:
        <div className='result'>
            <span id={colorType}>{colorValue}</span>
            <motion.div
                className='copy button'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onCopy(colorType)}
            >
                <Icon icon={isCopied ? "iconoir:check" : "iconoir:copy"} />
            </motion.div>
        </div>
    </>
  )
}

export default Output