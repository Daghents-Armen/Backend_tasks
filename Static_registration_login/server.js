const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

const app = express();

const public_dir = path.join(__dirname, 'public');
const data_folder = path.join(__dirname, 'data');
const users_file = path.join(data_folder, 'users.json');
const uploads_dir = path.join(public_dir, 'uploads')

if(!fs.existsSync(data_folder)){
    fs.mkdirSync(data_folder);
}

if(!fs.existsSync(uploads_dir)){
    fs.mkdirSync(uploads_dir);
}

if(!fs.existsSync(users_file)){
    fs.writeFileSync(users_file, JSON.stringify([]))
}

app.use(express.urlencoded({extended: true}));
app.use(express.static(public_dir))

const PORT = 3001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploads_dir);
    },

    filename: (req, file, cb) => {
      const unique_name =
        "image-" + Date.now() + path.extname(file.originalname);
      cb(null, unique_name);
    },
  });
  
  const upload = multer({
    storage,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
      const allowed_types = ["image/jpeg", "image/png", "image/webp"];

      if (!allowed_types.includes(file.mimetype)) {
        cb(new Error("Only jpeg, png, webp images allowed"));
      } else {
        cb(null, true);
      }
    },
  });


function read_file(){
    const data = fs.readFileSync(users_file, 'utf-8');
    return JSON.parse(data)
}

function write_file(users){
    fs.writeFileSync(users_file, JSON.stringify(users, null, 2))
}

function valid_email(email){
    if(!email.includes('@')) return false;

    const [name, domain] = email.split('@');

    if(!name || !domain) return false;

    if(!domain.includes('.')) return false;

    return true;
};

function valid_phone(phone){
    const allowed = ['0','1','2','3','4','5','6','7','8','9','+','-',' '];

    for (let i = 0; i < phone.length; ++i){
        if(!allowed.includes(phone[i])){
            return false;
        }
    }

    return true;
}

app.get('/', (req, res) => {
    res.redirect('register.html');
})

app.post('/api/register', upload.single('image'), (req, res) => {
    const {
        full_name,
        email,
        password,
        college,
        hobby,
        phone,
        age,
        city,
        github,
        bio,
      } = req.body;
    
      if (!full_name || full_name.length < 3) {
        return res.status(400).json({error: 'full name must be at least 3 characters'});
      }
    
      if (!email || !valid_email(email)) {
        return res.status(400).json({error: 'Invalid email'});
      }
    
      if (!password || password.length < 6) {
        return res.status(400).json({error: 'password must be at least 6 characters'});
      }
    
      if (phone && !valid_phone(phone)) {
        return res.status(400).json({error: 'Invalid phone'});
      }
    
      const user_age = Number(age)
      if (user_age && (isNaN(user_age) || user_age < 15 || user_age > 80)){
        return res.status(400).json({error: 'Invalid age'});
      }

      const users = read_file();

      const is_repeat = users.findIndex(user => user.email === email);
      if(is_repeat !== -1){
        return res.status(400).json({error: 'Email already exists'});
      }

      const image_url = req.file ? `/uploads/${req.file.filename}`: null;

      const new_user = {
        id: Date.now().toString(),
        full_name,
        email,
        password,
        college,
        hobby,
        phone,
        age,
        city,
        github,
        bio,
        image_url,
        createdAt: new Date().toISOString(),
      }

      users.push(new_user);
      write_file(users);

      res.status(200).json({
        message: 'User successfully registered',

        user: {
            full_name: new_user.full_name,
            email: new_user.email,
            image_url: new_user.image_url
        }
      })
})

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ errors: "Email and password are required"});
    }
  
    const users = read_file();
  
    const user = users.find(
      user => user.email === email && user.password === password
    );
  
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
  
    res.status(200).json({
      message: "Login successful",
      user: {
        full_name: user.full_name,
        email: user.email,
        image_url: user.image_url,
      },
    });
  });


app.get('/api/users', (req, res) => {
    const users = read_file();

    const user = users.map(({password, ...rest}) => rest);
    res.json(user);

})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})
  

