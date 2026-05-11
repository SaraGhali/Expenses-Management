import React from 'react'
import en from './en.json'
import ar from './ar.json'

const resources = {
  en: { translation: en },
  ar: { translation: ar }
}

let currentLanguage = localStorage.getItem('language') || 'en'
let listeners = []

export const i18n = {
  t: (key) => {
    const keys = key.split('.')
    const translation = resources[currentLanguage]?.translation
    let value = translation

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  },

  changeLanguage: (lang) => {
    currentLanguage = lang
    localStorage.setItem('language', lang)
    // Notify all listeners
    listeners.forEach(listener => listener(lang))
    // Also dispatch custom event for non-hook components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }))
  },

  getLanguage: () => currentLanguage,

  getDirection: () => currentLanguage === 'ar' ? 'rtl' : 'ltr',

  subscribe: (callback) => {
    listeners.push(callback)
    return () => {
      listeners = listeners.filter(l => l !== callback)
    }
  }
}

// React hook for translation
export const useTranslation = () => {
  const [language, setLanguage] = React.useState(currentLanguage)

  React.useEffect(() => {
    const unsubscribe = i18n.subscribe((lang) => {
      setLanguage(lang)
    })

    const handleLanguageChange = (e) => {
      setLanguage(e.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      unsubscribe()
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])

  return { 
    t: (key) => i18n.t(key), 
    language, 
    i18n,
    direction: i18n.getDirection()
  }
}
