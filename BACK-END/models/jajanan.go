package models

type (
	Jajanan struct {
		ID       uint     `gorm:"primaryKey;autoIncrement:true"`
		Name     string   `json:"name"`
		Price    int      `json:"price"`
		Location string   `json:"location"`
		Contact  string   `json:"contact"`
		Type     string   `json:"type"`
		Rating   float64  `json:"rating"`
		Photo    string   `json:"photo"`
		ImageURL string   `json:"imageURL"`
		UserID   uint     `json:"user_id"`
		Reviews []Review `json:"-"`
		User     User     `json:"-"`
	}
)
