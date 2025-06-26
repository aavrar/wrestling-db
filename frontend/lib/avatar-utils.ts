// Utility functions for generating consistent wrestler avatars

/**
 * Generate a consistent color based on wrestler name
 */
export function generateAvatarColor(name: string): string {
  const gradients = [
    'from-cyan-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-blue-500 to-indigo-600',
    'from-yellow-500 to-orange-600',
    'from-green-500 to-emerald-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-purple-600',
    'from-red-500 to-pink-600'
  ]
  
  // Create a simple hash from the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Use the hash to select a gradient
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

/**
 * Generate initials from wrestler name
 */
export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3) // Limit to 3 characters max
}

/**
 * Generate a wrestler avatar component props
 */
export function generateAvatarProps(name: string) {
  return {
    initials: generateInitials(name),
    gradient: generateAvatarColor(name)
  }
}