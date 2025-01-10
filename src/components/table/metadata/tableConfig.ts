import { Edit2, Trash2, Power, Plus, CheckSquare } from 'lucide-react';

export const TABLE_CONFIG = {
  icons: {
    edit: Edit2,
    delete: Trash2,
    toggle: Power,
    select: CheckSquare,
    add: Plus
  },
  messages: {
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ces éléments ?',
    confirmDeactivate: 'Êtes-vous sûr de vouloir désactiver ces éléments ?',
    noData: 'Aucune donnée disponible',
    error: {
      delete: 'Erreur lors de la suppression:',
      deactivate: 'Erreur lors de la désactivation:',
      toggle: 'Erreur lors du changement de statut:' // Add this line
    }
  },
  buttons: {
    new: 'Nouveau',
    bulkDelete: 'Supprimer la sélection',
    bulkDeactivate: 'Désactiver la sélection'
  },
  styles: {
    actionButton: "p-2 rounded-full hover:bg-gray-100 transition-colors",
    deleteButton: "text-red-600 hover:text-red-700",
    editButton: "text-blue-600 hover:text-blue-700",
    toggleButton: "text-gray-600 hover:text-gray-700",
    checkbox: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
    bulkActionButton: "inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md space-x-2",
    deactivateButton: "bg-gray-600 text-white hover:bg-gray-700",
    newButton: "bg-blue-600 text-white hover:bg-blue-700",
    iconButton: "h-4 w-4"
  },
  itemsPerPage: 10
};