require 'test_helper'

class ThreeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get square_rotation" do
    get :square_rotation
    assert_response :success
  end

end
