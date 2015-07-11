require 'bundler/setup'
Bundler.require

require 'models/comment'

Mongoid.load! File.expand_path('../config/mongoid.yml', __FILE__), :development