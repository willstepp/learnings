Rails.application.routes.draw do
  get 'two', to: 'two#index'
  get 'two/sierpenski_points'
  get 'two/sierpenski_triangles_2d'
  get 'two/sierpenski_triangles_3d'
  get 'two/pyramid'

  get 'three', to: 'three#index'
  get 'three/square_rotation'
  get 'three/cad'

  get 'four', to: 'four#index'

  root 'home#index'
end
