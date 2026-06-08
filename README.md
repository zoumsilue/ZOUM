# 🎓 Générateur de Cartes Scolaires

Plateforme web pour générer automatiquement des **cartes d'identité scolaires** en remplissant les champs à partir d'un fichier Excel (publipostage).

## 📋 Features

✅ Upload de fichiers Excel (.xlsx, .xls, .csv)  
✅ Génération automatique de PDF personnalisés  
✅ Interface web simple et intuitive  
✅ Téléchargement des cartes générées  
✅ Aperçu en ligne  
✅ Drag & drop pour les fichiers  

## 🚀 Installation

### Prérequis
- Node.js (v14+)
- npm ou yarn

### Étapes

1. **Cloner le dépôt**
```bash
git clone https://github.com/zoumsilue/ZOUM.git
cd ZOUM
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur**
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📝 Format du fichier Excel

Votre fichier Excel doit contenir les colonnes suivantes :

| Nom | Prénoms | Classe | Filière | Ne le | Père | Parents | Mère | Adresse complète | ... |
|-----|---------|--------|---------|-------|------|---------|------|------------------|-----|
| DUPONT | Jean | CM2 | Officiel | 15/05/2012 | Marc | DUPONT | Anne | 123 Rue de Paris | ... |
| MARTIN | Sophie | 6ème | Officiel | 20/03/2011 | Pierre | MARTIN | Isabelle | 456 Ave du Soleil | ... |

**Les en-têtes de colonne doivent correspondre exactement aux champs que vous voulez voir sur la carte.**

## 🔧 Utilisation

1. Accédez à `http://localhost:3000` dans votre navigateur
2. Sélectionnez ou déposez votre fichier Excel
3. Cliquez sur "Générer les cartes"
4. Les PDFs sont générés automatiquement
5. Téléchargez ou prévisualisez chaque carte

## 📂 Structure du projet

```
ZOUM/
├── server.js           # Serveur Express principal
├── package.json        # Dépendances
├── public/
│   ├── index.html      # Interface web
│   ├── style.css       # Styling
│   ├── script.js       # JavaScript côté client
│   └── output/         # PDFs générés (créé automatiquement)
├── uploads/            # Fichiers uploadés temporaires (créé automatiquement)
├── .gitignore
└── README.md
```

## 🎨 Personnalisation

### Modifier le design de la carte

Éditez la fonction `generateCard()` dans `server.js` :

```javascript
function generateCard(studentData, outputPath) {
  // Ajustez les couleurs, polices, etc.
  doc.fillColor('#2d5016')  // Couleur verte
  doc.fontSize(16)
  // ... votre design personnalisé
}
```

### Ajouter un logo

```javascript
doc.image('logo.png', 150, 50, { width: 100, height: 100 });
```

### Ajouter une photo

```javascript
if (studentData.photo) {
  doc.image(studentData.photo, 200, 150, { width: 80, height: 100 });
}
```

## 🚀 Déploiement

### Sur Heroku

```bash
heroku create votre-app
git push heroku main
```

### Sur Vercel

```bash
vercel
```

## 📦 Dépendances

- **express** - Serveur web
- **multer** - Gestion des uploads
- **xlsx** - Lecture des fichiers Excel
- **pdfkit** - Génération PDF
- **cors** - CORS middleware

## 🐛 Troubleshooting

**Erreur : "Seuls les fichiers Excel sont acceptés"**
- Vérifiez que votre fichier a l'extension .xlsx, .xls ou .csv

**Les champs ne s'affichent pas**
- Vérifiez que les en-têtes de votre Excel correspondent aux noms des champs

**Erreur de port déjà utilisé**
```bash
# Utiliser un autre port
PORT=3001 npm start
```

## 📞 Support

Pour toute question ou suggestion, créez une issue sur GitHub.

## 📄 License

MIT

---

**Créé avec ❤️ pour simplifier la gestion des cartes scolaires**
