require 'test_helper'

class TwoControllerTest < ActionController::TestCase
  test "should get sierpenski_points" do
    get :sierpenski_points
    assert_response :success
  end

end
