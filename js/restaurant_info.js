let restaurant
let map

/////////////////////////////////////TODO: Export from utils.js/////////
getImageAltText = image => {
  const altTexts = {
    '1.jpg': 'bustling dining room with chandeliers',
    '2.jpg': 'mozzarella cheese pizza with bubbly crust',
    '3.jpg': 'dining room styled with wooden and lots of stainless steel',
    '4.jpg': 'artistic photo of brick building shot from the corner exterior sidewalk',
    '5.jpg': 'cook smiles while overlooking a busy cozy scene',
    '6.jpg': 'a rustic dining room in a converted warehouse, with a large US flag decoration',
    '7.jpg': 'black and white photo of concrete textured frontage of Superiority Burger joint',
    '8.jpg': 'building with awning and sign above says the DUTCH',
    '9.jpg': 'people casually eating and drinking water, beer, and wine, some browse on cellphones',
    '10.jpg': 'modern white and chrome styled eating bar and seating area'
  }  
  return altTexts[image.src.split('/').pop()]
}

getImageSourceSet = image => {
  const src = image.src.split('.')[0]
  return `${src}-500px.jpg 500w, ${src}-1000px.jpg 1000w, ${src}-1500px.jpg 1500w`
}
/////////////////////////////////////////////////////////////////////////

window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(`When initMap, got error: ${error}`)
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false,
      })
      fillBreadcrumb()
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map)
    }
  })
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant)
    return
  }
  const id = getParameterByName('id')
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null)
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant
      if (!restaurant) {
        console.error(error)
        return
      }
      fillRestaurantHTML()
      callback(null, restaurant)
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name')
  name.innerHTML = restaurant.name

  const address = document.getElementById('restaurant-address')
  address.innerHTML = restaurant.address

  const image = document.getElementById('restaurant-img')
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant)
  image.srcset = getImageSourceSet(image)
  image.alt = getImageAltText(image)

  const cuisine = document.getElementById('restaurant-cuisine')
  cuisine.innerHTML = restaurant.cuisine_type

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML()
  }
  // fill reviews
  fillReviewsHTML()
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours')
  for (let key in operatingHours) {
    const row = document.createElement('tr')

    const day = document.createElement('td')
    day.innerHTML = key
    row.appendChild(day)

    const time = document.createElement('td')
    time.innerHTML = operatingHours[key]
    row.appendChild(time)

    hours.appendChild(row)
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container')
  const title = document.createElement('h2')
  title.innerHTML = 'Reviews'
  container.appendChild(title)

  if (!reviews) {
    const noReviews = document.createElement('p')
    noReviews.innerHTML = 'No reviews yet!'
    container.appendChild(noReviews)
    return
  }
  const ul = document.getElementById('reviews-list')
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review))
  })
  container.appendChild(ul)
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = review => {
  const li = document.createElement('li')
  const name = document.createElement('p')
  name.innerHTML = review.name
  li.appendChild(name)

  const date = document.createElement('p')
  date.innerHTML = review.date
  li.appendChild(date)

  const rating = document.createElement('p')
  rating.innerHTML = `Rating: ${review.rating}`
  li.appendChild(rating)

  const comments = document.createElement('p')
  comments.innerHTML = review.comments
  li.appendChild(comments)

  return li
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb')
  const li = document.createElement('li')
  li.innerHTML = restaurant.name
  breadcrumb.appendChild(li)
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
