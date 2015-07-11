class Comment
  include Mongoid::Document
  field :author, type: String
  field :text, type: String

  validates :author, presence: true
  validates :text, presence: true
end