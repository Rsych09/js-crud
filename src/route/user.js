// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      if (data.name) {
        product.name = data.name
      }

      if (data.price) {
        product.price = data.price
      }

      if (data.description) {
        product.description = data.description
      }

      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  // Створення нового об'єкта користувача
  const user = new User(email, login, password)

  User.add(user)

  console.log(user)
  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створенний',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Емайл пошта оновлена'
      : 'Сталася помилка',
  })
})

router.get('/product-create', function (req, res) {
  res.render('user-product-create', {
    style: 'user-product-create',
  })
})
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())

  res.render('user-product-alert', {
    style: 'user-product-alert',
    info: 'Товар успішно додано',
  })
})

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  console.log(list)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
router.post('/product-list', function (req, res) {
  const { name, price, description, id } = req.body

  const product = new Product(name, price, description, id)
  Product.add(product)

  console.log(user)
  console.log(User.getList())
  res.render('user-product-list', {
    style: 'user-product-list',
  })
})

router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  const product = Product.getById(Number(id))
  // console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('user-product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('user-product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-product-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.post('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id, name, price, description } = req.body
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('user-product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-product-alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('user-product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-product-alert',
      info: 'Сталася помилка',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(Number(id))
  // res.render генерує нам HTML сторінку
  // console.log(product)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-success-info', {
    style: 'user-success-info',
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
