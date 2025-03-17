package types

type Query struct {
	Limit     int64
	Skip      int64
	Sort      string
	Search    string
	TimeStart string
	TimeEnd   string
	Location  string
	PoliceId  string
}
