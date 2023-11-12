import React from 'react'
import { Icon } from '@iconify/react';
import { motion } from "framer-motion"

const Header = () => {
  return (
    <>
        <motion.div
            className='header'
            initial={{y: -100 }}
            animate={{y: 0 }}
            transition={{ duration: 0.75 }}
        >
            Color <span><Icon icon="iconoir:color-filter" />ode</span> Converter
        </motion.div>
    </>
  )
}

export default Header