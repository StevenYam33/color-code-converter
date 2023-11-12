import React from 'react'
import { Icon } from '@iconify/react';
import { motion } from "framer-motion"

const Footer = () => {
  return (
    <>
        <motion.div
            className='footer'
            initial={{x: 100, y: 100 }}
            animate={{x: 0, y: 0 }}
            transition={{ duration: 0.75 }}
        >
            <motion.div
                className='button'
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>{
                    window.open(`https://stevenyam.dev/`, '_blank')
                }}
            >
                <svg class="header-logo" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="m 32.5 6.5 l -15 12.5 l 15 12.5 l -15 12.5 m 7.5 -31.25 l 0 25"></path>
                </svg>
            </motion.div>
        </motion.div>
    </>
  )
}

export default Footer