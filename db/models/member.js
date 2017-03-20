'use strict'; // eslint-disable-line semi
/* eslint-disable camelcase */

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const db = require('APP/db')

//const Transaction = require('./transaction')
//const Product = require('./product')

const Member = db.define('members', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  ppid: Sequelize.STRING,
  party: Sequelize.ENUM('D', 'R', 'I')
//   ,
//   
// 
// 
// 
//   
//   email: {
//     type: Sequelize.STRING,
//     validate: {
// 			isEmail: true,
// 			notEmpty: true,
// 		}
//   },
//   isAdmin: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false
//   },
//   streetAddress: Sequelize.STRING,
//   city: Sequelize.STRING,
//   state: {
//     type: Sequelize.STRING,
//     validate: {
//       len: 2
//     }
//   },
//   zipCode: {
//     type: Sequelize.INTEGER,
//     validate: {
//       len: 5
//     }
//   },
//   creditCard: {
//     type: Sequelize.BIGINT,
//     validate: {
//       len: 16
//     }
//   },
//   cvc: {
//     type: Sequelize.INTEGER,
//     validate: {
//       len: 3
//     }

//   },

//   // We support oauth, so users may or may not have passwords.
//   password_digest: Sequelize.STRING, // This column stores the hashed password in the DB, via the beforeCreate/beforeUpdate hooks
// 	password: Sequelize.VIRTUAL // Note that this is a virtual, and not actually stored in DB
// }, {
// 	indexes: [{fields: ['email'], unique: true}],
//   hooks: {
//     beforeCreate: setEmailAndPassword,
//     beforeUpdate: setEmailAndPassword,
//   },
//   getterMethods: {
// 	  fullName: function() {
// 	    return this.firstName + ' ' + this.lastName
// 	  },
//     fullAddressWithName: function() {
// 	    return this.fullName + '\n' + this.streetAddress + '\n' + this.city + ', ' + this.state + ' ' + this.zipCode
//     }
//   },
//   instanceMethods: {
//     // This method is a Promisified bcrypt.compare
//     authenticate (plaintext) {
//       return new Promise((resolve, reject) =>
//         bcrypt.compare(plaintext, this.password_digest, (err, result) => {
//           if (err) reject(err)
//           else resolve(result)
//         })
//       )
//     },
//     verifyPurchase (productId) {
//       return this.getOrders({
//         where: {
//           status: { $ne: 'active' }
//         },
//         include: [Product]
//       })
//       .then(foundOrders => {
//           return foundOrders.some(order => {
//             return order.products.some(product => product.id === productId)
//           })
//       })
//     }
  // }
})

// function setEmailAndPassword(member) {
//   member.email = member.email && member.email.toLowerCase()
//   if (!member.password) return Promise.resolve(member)

//   return new Promise((resolve, reject) =>
// 	  bcrypt.hash(member.get('password'), 10, (err, hash) => {
// 		  if (err) reject(err)
// 		  member.set('password_digest', hash)
//       resolve(member)
// 	  })
//   )
// }

module.exports = Member
