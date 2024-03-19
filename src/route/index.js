// Підключаємо технологію express для back-end сервера
const express = require('express')
const { info, Value } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRamndomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  'Компьютер Cobra Advanced I14F.16',
  'Intel Core i5-10400F (2.9 - 4.3 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce GTX 1660 Super, 6 ГБ / без ОД / LAN / без ОС',
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Компьютер Cobra Advanced I14F',
  'Intel Core i5-10400F (2.9 - 4.3 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce GTX 1660 Super, 6 ГБ / без ОД / LAN / без ОС',
  [{ id: 1, text: 'Готовий до відправки' }],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Компьютер Cobra Advanced 16',
  'Intel Core i5-10400F (2.9 - 4.3 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce GTX 1660 Super, 6 ГБ / без ОД / LAN / без ОС',
  [{ id: 1, text: 'Готовий до відправки' }],
  27000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updateBonusBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBonusBalance)

    console.log(email, updateBonusBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bnus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = data.product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-product', function (req, res) {
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-product',

    data: {
      list: Product.getRamndomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('user-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/user-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('user-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'user-alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/user-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: Product.DELIVERY_PRICE,
        },
        {
          text: `Доставка`,
          price: Product.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount)
  ) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )
  console.log(purchase)

  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створене ',
      link: '/user-list',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-orders', function (req, res) {
  const list = Product.getList()
  const id = Number(req.query.id)
  const title = Product.title
  const price = Product.price
  const bonus = Purchase.bonus
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-orders', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-orders',

    data: {
      purchases: { list },
      id: id,
      title: title,
      price: price,
      bonus: bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-product-info', function (req, res) {
  const list = Product.getList()
  const id = Number(req.query.id)
  const title = Product.title
  const price = Product.price
  const bonus = Purchase.bonus
  const name = Purchase.firstname
  const lastname = Purchase.lastname
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-product-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-product-info',

    data: {
      purchases: { list },
      id: id,
      title: title,
      price: price,
      bonus: bonus,
      name: name,
      lastname: lastname,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
