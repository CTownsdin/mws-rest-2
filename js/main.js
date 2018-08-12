let restaurants, neighborhoods, cuisines
var map
var markers = []

/////////////////////////////////////TODO: Export from utils.js/////////
/**
* Given an image, return alt text for that image.
* Includes mapping of alt texts to images.
*/
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

/*
* Given an image, return a srcset for it.
* like: srcset="/img/1-500px.jpg 500w, /img/1-1000px.jpg 1000w, /img/1-1500px.jpg 1500w"
*/
getImageSourceSet = image => {
  const src = image.src.split('.')[0]
  return `${src}-500px.jpg 500w, ${src}-1000px.jpg 1000w, ${src}-1500px.jpg 1500w`
}
/////////////////////////////////////////////////////////////////////////

/* register service worker */
registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('../sw.js')
        .then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err)
          }
        )
    })
  }
}

registerServiceWorker()

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods()
  fetchCuisines()
})

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error)
    } else {
      self.neighborhoods = neighborhoods
      fillNeighborhoodsHTML()
    }
  })
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select')
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option')
    option.innerHTML = neighborhood
    option.value = neighborhood
    select.append(option)
  })
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error)
    } else {
      self.cuisines = cuisines
      fillCuisinesHTML()
    }
  })
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select')

  cuisines.forEach(cuisine => {
    const option = document.createElement('option')
    option.innerHTML = cuisine
    option.value = cuisine
    select.append(option)
  })
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501,
  }
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
  })
  updateRestaurants()
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select')
  const nSelect = document.getElementById('neighborhoods-select')

  const cIndex = cSelect.selectedIndex
  const nIndex = nSelect.selectedIndex

  const cuisine = cSelect[cIndex].value
  const neighborhood = nSelect[nIndex].value

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      // Got an error!
      console.error(error)
    } else {
      resetRestaurants(restaurants)
      fillRestaurantsHTML()
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = []
  const ul = document.getElementById('restaurants-list')
  ul.innerHTML = ''

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove())
  }
  self.markers = []
  self.restaurants = restaurants
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list')
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant))
  })
  addMarkersToMap()
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement('li')

  const restaurantContainerDiv = document.createElement('div')
  restaurantContainerDiv.classList.add('restaurant-container')

  const topDiv = document.createElement('div')
  const image = document.createElement('img')
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant)
  image.srcset = getImageSourceSet(image)
  image.alt = getImageAltText(image)

  topDiv.append(image)

  const name = document.createElement('h1')
  name.innerHTML = restaurant.name

  restaurantContainerDiv.append(topDiv)

  const bottomDiv = document.createElement('div')
  const neighborhood = document.createElement('p')
  neighborhood.innerHTML = restaurant.neighborhood

  const address = document.createElement('p')
  address.innerHTML = restaurant.address
  
  const viewDetails = document.createElement('a')
  viewDetails.innerHTML = 'View Details'
  viewDetails.href = DBHelper.urlForRestaurant(restaurant)

  bottomDiv.append(name)
  bottomDiv.append(neighborhood)
  bottomDiv.append(address)
  bottomDiv.append(viewDetails)
  bottomDiv.classList.add('restaurant-info')

  restaurantContainerDiv.append(bottomDiv)

  li.append(restaurantContainerDiv)
  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map)
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    })
    self.markers.push(marker)
  })
}
