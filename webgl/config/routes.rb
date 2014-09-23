Rails.application.routes.draw do
  get 'two', to: 'two#index'
  get 'two/sierpenski_points'
  get 'two/sierpenski_triangles'

  root 'home#index'
end
