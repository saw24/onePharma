# Guide complet : Déploiement React (Vite) + Backend Node.js avec PM2 et Nginx

---

## 1. Pré-requis
- Node.js installé
- Nginx installé
- Certbot pour HTTPS
- PM2 globalement : `npm install -g pm2`
- Accès root ou sudo

---

## 2. Build du frontend React (Vite)
```bash
cd /chemin/vers/frontend
npm install
npm run build
```
- Le build sera généré dans `dist/`.

---

## 3. Configurer Nginx pour le domaine
1. Crée le fichier Nginx :
```bash
sudo nano /etc/nginx/sites-available/1pharma.org
```
2. Exemple de configuration :
```nginx
server {
    listen 80;
    server_name 1pharma.org www.1pharma.org;

    root /var/www/1pharma.org/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    access_log /var/log/nginx/1pharma.org.access.log;
    error_log /var/log/nginx/1pharma.org.error.log;
}
```
3. Active le site :
```bash
sudo ln -s /etc/nginx/sites-available/1pharma.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Activer HTTPS avec Let’s Encrypt
```bash
sudo certbot --nginx -d 1pharma.org -d www.1pharma.org
```
- Certificat généré automatiquement et Nginx mis à jour.
- Renouvellement automatique configuré.

---

## 5. Lancer le frontend avec PM2
```bash
pm2 delete onepharma-client        # si déjà existant
pm2 start serve --name "onepharma-client" -- -s dist -l 9999
pm2 list
pm2 logs onepharma-client
```
- `-s dist` → support SPA
- `-l 9999` → port de l’app

---

## 6. Lancer le backend Node.js avec PM2
```bash
cd /chemin/vers/backend
pm2 start index.js --name "backend"
pm2 list
pm2 logs backend
```

---

## 7. Sauvegarder la configuration PM2 et activer le démarrage automatique
```bash
pm2 save
pm2 startup
```
- Copie-colle la commande fournie par `pm2 startup` pour activer le service au boot.
- Vérifie :
```bash
systemctl status pm2-onepharma
```

---

## 8. Gérer les apps PM2
- Redémarrer : `pm2 restart <app>`
- Stopper : `pm2 stop <app>`
- Supprimer : `pm2 delete <app>`
- Logs : `pm2 logs <app>`

---

## 9. Astuces
- Chaque frontend React/Vite doit être servi sur un port différent si plusieurs apps.
- Toujours utiliser `serve -s dist` pour SPA React.
- Pour HTTPS, Nginx et Certbot gèrent automatiquement la redirection HTTP → HTTPS.

