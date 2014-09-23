Rails.application.routes.draw do
  get 'two', to: 'two#index'
  get 'two/sierpenski_points'

  root 'home#index'
end
