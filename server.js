const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuration multer pour les uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers Excel (.xlsx, .xls) ou CSV sont acceptés'));
    }
  }
});

// Créer les dossiers nécessaires
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('public/output')) fs.mkdirSync('public/output', { recursive: true });

/**
 * Route de test
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Serveur en fonctionnement ✅' });
});

/**
 * Route upload Excel + Génération cartes
 */
app.post('/api/generate-cards', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Lire le fichier Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'Le fichier Excel est vide' });
    }

    // Générer les PDFs
    const outputDir = 'public/output';
    const pdfPaths = [];

    data.forEach((row, index) => {
      const pdfPath = path.join(outputDir, `carte_${index + 1}.pdf`);
      generateCard(row, pdfPath);
      pdfPaths.push(`/output/carte_${index + 1}.pdf`);
    });

    // Nettoyer le fichier uploadé
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${data.length} cartes générées avec succès`,
      cartes: pdfPaths,
      data: data
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fonction de génération de carte scolaire
 */
function generateCard(studentData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Fond coloré
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0');

      // Bordure
      doc.strokeColor('#2d5016')
        .lineWidth(3)
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke();

      // En-tête
      doc.fillColor('#2d5016')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('CARTE D\'IDENTITÉ SCOLAIRE', 50, 60, { align: 'center' });

      // Séparateur
      doc.strokeColor('#2d5016')
        .lineWidth(1)
        .moveTo(50, 90)
        .lineTo(doc.page.width - 50, 90)
        .stroke();

      // Contenu principal
      let yPosition = 120;
      const fieldSpacing = 50;

      doc.fillColor('#000')
        .fontSize(11)
        .font('Helvetica');

      // Afficher les données disponibles
      Object.entries(studentData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          doc.fontSize(10)
            .font('Helvetica-Bold')
            .text(`${key}:`, 60, yPosition);

          doc.fontSize(10)
            .font('Helvetica')
            .text(String(value), 150, yPosition);

          yPosition += fieldSpacing;

          if (yPosition > doc.page.height - 100) {
            doc.addPage();
            yPosition = 50;
          }
        }
      });

      // Footer
      doc.fontSize(8)
        .fillColor('#666')
        .text('Généré par Plateforme Carte Scolaire', 50, doc.page.height - 40, { align: 'center' });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Route pour obtenir la liste des cartes générées
 */
app.get('/api/cards', (req, res) => {
  try {
    const outputDir = 'public/output';
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
    res.json({ cards: files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Envoyez vos fichiers Excel à http://localhost:${PORT}/api/generate-cards`);
});
