require 'boot'

class Reactive < Sinatra::Base
  error Mongoid::Errors::Validations do
    halt 422, env['sinatra.error'].record.errors.messages.to_json
  end

  helpers do
    def comment
      @comment ||= Comment.find(params[:id]) rescue halt(404)
    end
  end

  get '/' do
    erb :index
  end

  get '/comments' do
    content_type :json
    Comment.all.to_json
  end

  post '/comments' do
    content_type :json
    comment = Comment.new params[:comment]
    comment.save!
    comment.to_json
  end

  get '/comments/:id' do
    content_type :json
    comment.to_json
  end

  patch '/comments/:id' do
    content_type :json
    comment.update! params[:comment]
    comment.to_json
  end

  delete '/comments/:id' do
    content_type :json
    comment.delete
  end
end