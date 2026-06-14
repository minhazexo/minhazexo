'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { footerSocialLinks } from '@/data/social'

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 py-12 border-t border-white/5" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a href="#hero" className="text-2xl font-orbitron font-bold gradient-text inline-block mb-2" aria-label="Back to top">
              {'<MH/>'}
            </a>
            <p className="text-gray-500 text-sm">
              © {currentYear} MD Mehrab Hossain. All rights reserved.
            </p>
          </motion.div>

          {/* Built With */}
          <motion.div
            className="flex items-center gap-2 text-gray-500 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              aria-hidden="true"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>{' '}
            using React, Next.js & Tailwind
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {footerSocialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass text-gray-400 hover:text-accent transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                aria-label={`${social.label} (opens in new tab)`}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
})