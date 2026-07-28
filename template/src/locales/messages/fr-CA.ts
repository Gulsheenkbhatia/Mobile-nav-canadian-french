import type { NavUiMessages } from '../types'

export const frCAMessages: NavUiMessages = {
  search: 'Rechercher',
  searchAria: 'Rechercher',
  trackOrder: 'Suivre ma commande',
  help: 'Aide',
  currency: '$ CAD',
  login: 'Connexion',
  closeMenu: 'Fermer le menu',
  menu: 'Menu',
  bagItems: (count) => `Sac, ${count} article${count === 1 ? '' : 's'}`,
  back: 'Retour',
  backToMainMenu: 'Retour au menu principal',
  accountAndSupport: 'Compte et assistance',
  brand: 'Marque',
  shopNavigation: 'Navigation de la boutique',
  shopByCategory: 'Magasiner par catégorie',
  viewAll: 'Afficher tout',
  viewAllNamed: (name) => `Afficher tout ${name}`,
  copyGoesHere: 'Texte ici',
}
