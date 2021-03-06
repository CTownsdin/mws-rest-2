class DBHelper {
  static fetchRestaurants(callback) {
    fetch('http://localhost:1337/restaurants')
      .then(res => res.json())
      .then(json => callback(null, json))
      .catch(err => {
        console.error(`Problem fetching restaurants from DB: ${err.message}`)
        callback(err, null)
      })
  }

  static fetchRestaurantById(id, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const restaurant = restaurants.find(r => r.id == id)
        if (restaurant) {
          callback(null, restaurant)
        } else {
          callback('Restaurant does not exist', null)
        }
      }
    })
  }

  static fetchRestaurantByCuisine(cuisine, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const results = restaurants.filter(r => r.cuisine_type == cuisine)
        callback(null, results)
      }
    })
  }

  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const results = restaurants.filter(r => r.neighborhood == neighborhood)
        callback(null, results)
      }
    })
  }

  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        let results = restaurants
        if (cuisine != 'all') {
          results = results.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') {
          results = results.filter(r => r.neighborhood == neighborhood)
        }
        callback(null, results)
      }
    })
  }

  static fetchNeighborhoods(callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods)
      }
    })
  }

  static fetchCuisines(callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines)
      }
    })
  }

  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`
  }

  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}`
  }

  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP,
    })
    return marker
  }
}
