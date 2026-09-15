require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'class_profile',
  ssl: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
  },
};

const rootConfig = {
  ...dbConfig,
  database: undefined,
};

const students = [
  { full_name: 'Aang Burhanudin Badsah', nickname: 'Aang', expertise: 'IoT & Embedded Systems', skills: 'Arduino, Sensor, Automation', hobbies: 'Membaca, Desain', future_goals: 'Menjadi engineer IoT', description: 'Siswa yang tertarik pada perangkat pintar dan otomatisasi.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Adinda Ramadhani', nickname: 'Dinda', expertise: 'Web Development', skills: 'HTML, CSS, JavaScript', hobbies: 'Ngoding, Menulis', future_goals: 'Menjadi frontend developer', description: 'Siswa yang antusias dengan desain dan pengembangan web.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Anantadewa Wiwasata Putra Maharani', nickname: 'Dewa', expertise: 'Networking', skills: 'Routing, Troubleshooting, Mikrotik', hobbies: 'Gaming, Teknologi', future_goals: 'Administrator jaringan', description: 'Memahami konsep jaringan dan problem solving secara logis.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Annisa Ramadhani Putri Adiwanto', nickname: 'Annisa', expertise: 'Cyber Security', skills: 'Linux, Ethical Hacking, Wireshark', hobbies: 'Belajar keamanan digital', future_goals: 'Security analyst', description: 'Aktif mempelajari keamanan siber dan analisis jaringan.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Ariel Ardanta Nurrohman Reyhandy', nickname: 'Ariel', expertise: 'Database Management', skills: 'SQL, MariaDB, Query', hobbies: 'Membaca, Musik', future_goals: 'Database administrator', description: 'Tertarik pada pengelolaan data dan struktur basis data.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Bima Gusto Mahatsafa', nickname: 'Bima', expertise: 'Programming', skills: 'Python, JavaScript, Logic', hobbies: 'Coding, Olahraga', future_goals: 'Software engineer', description: 'Siswa yang tekun dalam logika dan pengembangan aplikasi.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Byantara Al Hakim Nadhif', nickname: 'Byan', expertise: 'Cloud & DevOps', skills: 'Docker, Git, Linux', hobbies: 'Eksperimen teknologi', future_goals: 'Cloud engineer', description: 'Menyukai otomatisasi dan infrastruktur digital.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Cleosya Kapita Bilqist', nickname: 'Cleo', expertise: 'UI/UX', skills: 'Figma, Design Thinking', hobbies: 'Menggambar, Fotografi', future_goals: 'UI/UX designer', description: 'Memiliki rasa estetika yang kuat untuk produk digital.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Devina Aurelia Hapsari', nickname: 'Devina', expertise: 'Digital Marketing', skills: 'Konten, Branding, SEO', hobbies: 'Membuat konten', future_goals: 'Content strategist', description: 'Menyukai komunikasi digital dan branding produk.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Ezar Brilliant Sugiono', nickname: 'Ezar', expertise: 'Robotics', skills: 'Sensor, Logic, Prototype', hobbies: 'Robotika, Belajar', future_goals: 'Robot engineer', description: 'Antusias pada pembuatan alat cerdas dan prototipe.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Farhan Auliya Abrar', nickname: 'Farhan', expertise: 'System Administration', skills: 'Windows, Linux, Server', hobbies: 'IT, Teknologi', future_goals: 'Sysadmin', description: 'Membahas konfigurasi perangkat dan layanan komputer.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Flavia Annisa Kurniawan', nickname: 'Flavia', expertise: 'Frontend Design', skills: 'CSS, Design System, UX', hobbies: 'Desain, Kreativitas', future_goals: 'Front-end designer', description: 'Siswa yang fokus pada tampilan dan user experience.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Gusti Putra Khakim Khaqiqi', nickname: 'Gusti', expertise: 'Networking', skills: 'Switching, Routing, Kabel', hobbies: 'Teknologi, Komputer', future_goals: 'Network engineer', description: 'Tertarik pada infrastruktur jaringan dan komunikasi data.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Hatta Muhlasin Luhtari', nickname: 'Hatta', expertise: 'Programming', skills: 'PHP, JavaScript, Logic', hobbies: 'Coding, Kecerdasan buatan', future_goals: 'Developer', description: 'Suka membangun fitur dan menyelesaikan masalah logika.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Intan Alshani Raffisya', nickname: 'Intan', expertise: 'Cyber Security', skills: 'Forensics, Security, Linux', hobbies: 'Membaca, Cyber security', future_goals: 'Ethical hacker', description: 'Cermat dalam analisis sistem dan keamanan informasi.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Iqbal Ilmi', nickname: 'Iqbal', expertise: 'Game Development', skills: 'Unity, Design, Logic', hobbies: 'Game, Teknologi', future_goals: 'Game developer', description: 'Menyukai pembuatan game dan pengalaman interaktif.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Ivander Ardell Alvaro', nickname: 'Ivander', expertise: 'Programming', skills: 'Java, C++, Logic', hobbies: 'Ngoding, Belajar', future_goals: 'Software developer', description: 'Bersungguh-sungguh dalam penerapan logika pemrograman.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Kenza Almira Yasmin', nickname: 'Kenza', expertise: 'Data Analysis', skills: 'Excel, Spreadsheet, Reporting', hobbies: 'Membaca, Organisasi', future_goals: 'Data analyst', description: 'Senang menganalisis pola data dan membuat laporan.', profile_picture_path: '/images/default.svg' },
  { full_name: 'M. Rafa Rizky Effendi', nickname: 'Rafa', expertise: 'Networking', skills: 'Mikrotik, DNS, IP', hobbies: 'Teknologi, Networking', future_goals: 'Network technician', description: 'Cinta pada konfigurasi jaringan dan paket data.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Mochammad Davin Al Fida', nickname: 'Davin', expertise: 'Software Development', skills: 'React, Node.js, REST API', hobbies: 'Ngoding, Belajar', future_goals: 'Full-stack developer', description: 'Bersemangat pada pengembangan aplikasi modern.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Muhammad Faris Anshori', nickname: 'Faris', expertise: 'Web Development', skills: 'PHP, Laravel, CSS', hobbies: 'Coding, UI Design', future_goals: 'Web developer', description: 'Paham pengembangan antarmuka dan aplikasi berbasis web.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Muhammad Hamizan Zuhri', nickname: 'Hamizan', expertise: 'System Support', skills: 'Hardware, Troubleshooting, IT', hobbies: 'Perbaikan komputer', future_goals: 'IT support specialist', description: 'Tangguh dalam menangani masalah perangkat dan layanan.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Muhammad Kemal Faza', nickname: 'Kemal', expertise: 'Network Infrastructure', skills: 'Routing, Patching, Cabling', hobbies: 'Teknologi, Olahraga', future_goals: 'IT infrastructure engineer', description: 'Memiliki perhatian pada arsitektur jaringan yang stabil.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Muhammad Rifqi Nasywan Athallah', nickname: 'Rifqi', expertise: 'Backend Development', skills: 'API, Node.js, Database', hobbies: 'Belajar teknologi', future_goals: 'Backend engineer', description: 'Menyukai pengembangan logika aplikasi dan integrasi data.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Nazriel Abiy Putra Veangga', nickname: 'Nazriel', expertise: 'Cyber Security', skills: 'Firewall, Linux, Analysis', hobbies: 'Keamanan digital', future_goals: 'Security engineer', description: 'Bersungguh dalam memahami ancaman siber dan mitigasi.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Nizar Zulmi Firmansyah', nickname: 'Nizar', expertise: 'Automation', skills: 'Python, PLC, Logic', hobbies: 'Robotika, Teknologi', future_goals: 'Automation engineer', description: 'Tertarik pada otomatisasi proses dan perangkat pintar.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Radine Dygtastya Rahmadhani', nickname: 'Radine', expertise: 'Mobile Apps', skills: 'Flutter, UI, Logic', hobbies: 'Belajar aplikasi', future_goals: 'Mobile developer', description: 'Menyukai inovasi pada aplikasi mobile yang user friendly.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Rahel Maryam', nickname: 'Rahel', expertise: 'Graphic Design', skills: 'Photoshop, Canva, Layout', hobbies: 'Desain, Menyanyi', future_goals: 'Graphic designer', description: 'Memiliki kemampuan seni dan kreativitas tinggi dalam desain.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Satria Banyu Seki', nickname: 'Satria', expertise: 'Embedded Systems', skills: 'Microcontroller, Arduino, Wiring', hobbies: 'Elektronika, Robotika', future_goals: 'Embedded engineer', description: 'Sangat antusias terhadap perangkat elektronik dan sistem terkendali.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Valvizzy Piscesio Lois', nickname: 'Valvizzy', expertise: 'Data Science', skills: 'Python, Analysis, Research', hobbies: 'Belajar data', future_goals: 'Data scientist', description: 'Menyukai analisis data dan pengambilan keputusan berbasis pola.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Yohan Alim Wijaya', nickname: 'Yohan', expertise: 'Electronics', skills: 'PCB, Arduino, Circuit', hobbies: 'Elektronika, Teknologi', future_goals: 'Electronics engineer', description: 'Rasa ingin tahu yang tinggi dalam rangkaian elektronik.', profile_picture_path: '/images/default.svg' },
  { full_name: 'Ziyadatul Ilman Nafiah', nickname: 'Ziya', expertise: 'Web & Multimedia', skills: 'HTML, Video, Editing', hobbies: 'Editing, Kreativitas', future_goals: 'Multimedia professional', description: 'Bergairah dalam desain digital dan konten visual.', profile_picture_path: '/images/default.svg' }
];

async function createSchema(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) DEFAULT NULL,
      class_name VARCHAR(100) DEFAULT 'XI TKJ 3',
      expertise VARCHAR(255) DEFAULT NULL,
      skills VARCHAR(255) DEFAULT NULL,
      hobbies VARCHAR(255) DEFAULT NULL,
      future_goals VARCHAR(255) DEFAULT NULL,
      description TEXT,
      profile_picture_path VARCHAR(255) DEFAULT '/images/default.jpg',
      photo_url VARCHAR(255) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    ALTER TABLE students
    ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255) DEFAULT NULL;
  `);
}

async function seedData() {
  const rootConnection = await mysql.createConnection(rootConfig);
  try {
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  } finally {
    await rootConnection.end();
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    await createSchema(connection);
    await connection.execute('DELETE FROM students');
    await connection.execute('DELETE FROM users');
    await connection.execute('DELETE FROM comments');

    for (const student of students) {
      await connection.execute(
        `INSERT INTO students (full_name, nickname, class_name, expertise, skills, hobbies, future_goals, description, profile_picture_path, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          student.full_name,
          student.nickname,
          'XI TKJ 3',
          student.expertise,
          student.skills,
          student.hobbies,
          student.future_goals,
          student.description,
          student.profile_picture_path,
          null,
        ]
      );
    }

    const admins = [
      { username: 'reyhandy', password: 'syncup' },
      { username: 'rifqi', password: 'rifqi123' },
    ];

    for (const admin of admins) {
      await connection.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [admin.username, admin.password]
      );
    }

    console.log('Seeded 32 students and admin users into the database successfully.');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

seedData();
