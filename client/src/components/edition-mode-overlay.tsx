import { useEffect } from 'react';
import { useEdition } from '@/lib/edition-context';

export function EditionModeOverlay() {
  const { isEditionMode, canEdit } = useEdition();

  useEffect(() => {
    if (isEditionMode && canEdit) {
      // Prevent all clicks on buttons and links when edition mode is active
      const handleGlobalClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Allow clicks on TranslatableText and its children
        if (target.closest('.translatable-text') || target.closest('[data-translatable]')) {
          return;
        }
        
        // Prevent clicks on buttons, links, and other interactive elements
        if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.hasAttribute('role') && target.getAttribute('role') === 'button'
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      };

      // Add event listener with capture to intercept before other handlers
      document.addEventListener('click', handleGlobalClick, true);
      
      // Add visual indicator that edition mode is active
      document.body.style.cursor = 'text';
      document.body.setAttribute('data-edition-mode', 'true');

      return () => {
        document.removeEventListener('click', handleGlobalClick, true);
        document.body.style.cursor = '';
        document.body.removeAttribute('data-edition-mode');
      };
    }
  }, [isEditionMode, canEdit]);

  return null;
}