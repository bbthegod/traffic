package controller

type AppController struct {
	Auth          interface{ Auth }
	User          interface{ User }
	Violation     interface{ Violation }
	ViolationType interface{ ViolationType }
}
