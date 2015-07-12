require 'boot'

class Reactive < Sinatra::Base
  error Mongoid::Errors::Validations do
    halt 422, env['sinatra.error'].record.errors.messages.to_json
  end

  helpers do
    def comment
      @comment ||= Comment.find(params[:id]) rescue halt(404)
    end

    def data
      @data ||= JSON.parse request.body.read
    end
  end

  get '/' do
    erb :index
  end

  get '/comments', provides: :json do
    comment = Comment.all
    comment.to_json
  end

  post '/comments', provides: :json do
    comment = Comment.new data
    comment.save!
    comment.to_json
  end

  get '/comments/:id', provides: :json do
    comment.to_json
  end

  patch '/comments/:id', provides: :json do
    comment.update! data
    comment.to_json
  end

  delete '/comments/:id', provides: :json do
    comment.delete
  end
end