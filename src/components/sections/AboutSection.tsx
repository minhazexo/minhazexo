'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { milestones, skills } from '@/data/about'
import { imageAssets } from '@/data/assets'
import { SectionHeader } from '@/components/effects/CinematicSection'
import { TiltCard } from '@/components/effects/TiltCard'
import { cinematicEase } from '@/hooks/useCinematicReveal'

function EnergySkillBar({ name, level, index, isInView }: { name: string; level: number; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.4 + index * 0.1, ease: cinematicEase }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <motion.span
          className="text-white font-medium font-mono tracking-wide text-sm"
          animate={isHovered ? { x: 5 } : { x: 0 }}
        >
          {`> ${name}`}
        </motion.span>
        <motion.span
          className="text-indigo-400 font-orbitron text-sm"
          animate={isHovered ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 0.7 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-500/10 relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #4f46e5, #818cf8, #6366f1)',
            boxShadow: isHovered ? '0 0 15px rgba(99,102,241,0.5)' : 'none',
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
        >
          {/* Energy pulse effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
          />
        </motion.div>
        {/* Grid overlay on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(99,102,241,0.3) 4px, rgba(99,102,241,0.3) 5px)',
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

function ConstellationNode({ year, title, description, color, index, isInView, isLeft }: {
  year: string;
  title: string;
  description: string;
  color: string;
  index: number;
  isInView: boolean;
  isLeft: boolean;
}) {
  return (
    <motion.div
      className={`flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:flex-row group`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.7 + index * 0.15, ease: cinematicEase }}
    >
      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
        <motion.div
          className="relative p-6 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.6))',
            border: `1px solid ${color}30`,
          }}
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Constellation connection lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />
          
          {/* Year with glow */}
          <motion.span
            className="font-orbitron font-bold text-2xl tracking-wider"
            style={{ color }}
            animate={{ textShadow: [`0 0 10px ${color}40`, `0 0 20px ${color}60`, `0 0 10px ${color}40`] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {year}
          </motion.span>
          
          <h4 className="text-white font-bold mt-2 text-lg font-mono tracking-tight">{title}</h4>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">{description}</p>
          
          {/* Decorative corner accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l" style={{ borderColor: `${color}40` }} />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r" style={{ borderColor: `${color}40` }} />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l" style={{ borderColor: `${color}40` }} />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r" style={{ borderColor: `${color}40` }} />
        </motion.div>
      </div>
      
      {/* Center Star Node */}
      <div className="w-full md:w-2/12 flex justify-center my-4 md:my-0 relative z-10">
        <motion.div
          className="w-6 h-6 rounded-full relative"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 25px ${color}80, 0 0 50px ${color}40`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.8 + index * 0.15, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.5 }}
        >
          {/* Inner pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
        </motion.div>
      </div>
      
      {/* Empty Space */}
      <div className="hidden md:block md:w-5/12" />
    </motion.div>
  )
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 relative overflow-hidden"
      aria-label="About Me"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with cinematic reveal */}
        <SectionHeader
          label="// who_i_am"
          title="ABOUT ME"
          subtitle="Passionate about creating digital experiences that make a difference"
          isInView={isInView}
        />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Profile Image */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: cinematicEase, delay: 0.2 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
              <Image
                src={imageAssets.profile}
                alt="MD Mehrab Hossain - Profile"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 288px, 384px"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-indigo-500/20" />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: cinematicEase, delay: 0.3 }}
          >
            <div className="space-y-4 mb-8">
  <motion.p
    className="text-lg text-gray-300 leading-relaxed"
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: 0.4, ease: cinematicEase }}
  >
    I'm a passionate web developer with over 3 years of experience creating
    stunning digital experiences. My journey began with a curiosity for how
    things work on the web, which evolved into a deep love for crafting
    beautiful, functional applications.
  </motion.p>

  <motion.p
    className="text-lg text-gray-300 leading-relaxed"
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: 0.5, ease: cinematicEase }}
  >
    I specialize in React, Next.js, and Node.js, with a keen eye for design
    and user experience. Every project I undertake is an opportunity to push
    boundaries and create something extraordinary.
  </motion.p>
</div>

            {/* Skills with Energy Flow */}
            <div className="space-y-4" role="list" aria-label="Core skills proficiency levels">
              <motion.h3
                className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55, ease: cinematicEase }}
              >
                <span className="text-indigo-400">{'>'}</span>
                CORE_SKILLS
                <span className="w-2 h-5 bg-indigo-400 animate-pulse" />
              </motion.h3>
              {skills.map((skill, index) => (
                <EnergySkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Constellation Timeline */}
        <div className="mt-24">
          <motion.h3
            className="text-2xl md:text-3xl font-orbitron font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, ease: cinematicEase }}
          >
            <span className="gradient-text">JOURNEY_CONSTELLATION</span>
          </motion.h3>
          
          <div className="relative" aria-label="Career timeline">
            {/* Constellation connecting line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] hidden md:block" aria-hidden="true">
              <motion.div
                className="h-full w-full"
                style={{
                  background: 'linear-gradient(to bottom, #4f46e5, #818cf8, #a78bfa, #6366f1)',
                }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
            
            {/* Constellation dots along the line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-12 hidden md:flex flex-col items-center justify-between py-4" aria-hidden="true">
              {milestones.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-indigo-400"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : {}}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  style={{
                    marginTop: i === 0 ? 0 : 'auto',
                    marginBottom: i === milestones.length - 1 ? 0 : 'auto',
                  }}
                />
              ))}
            </div>
            
            <div className="space-y-12" role="list" aria-label="Career milestones">
              {milestones.map((milestone, index) => (
                <ConstellationNode
                  key={milestone.year}
                  year={milestone.year}
                  title={milestone.title}
                  description={milestone.description}
                  color={milestone.color}
                  index={index}
                  isInView={isInView}
                  isLeft={index % 2 === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
