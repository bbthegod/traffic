package common

import (
	"encoding/json"
	"errors"
	"os"
	"strconv"
	"ts-backend/package/domain/model"
	"ts-backend/package/types"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var validate = validator.New()

func GetIDParam(c *gin.Context) (primitive.ObjectID, error) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		return id, err
	}
	return id, nil
}

func GetQueries(c *gin.Context) (types.Query, error) {
	query := types.Query{}
	limit, err := strconv.ParseInt(c.DefaultQuery("limit", "500"), 10, 64)
	if err != nil {
		return query, errors.New("limit must be a number")
	}
	skip, err := strconv.ParseInt(c.DefaultQuery("skip", "0"), 10, 64)
	if err != nil {
		return query, errors.New("skip must be a number")
	}
	search := c.DefaultQuery("search", "")
	sort := c.DefaultQuery("sort", "")
	timeStart := c.DefaultQuery("timeStart", "")
	timeEnd := c.DefaultQuery("timeEnd", "")
	location := c.DefaultQuery("location", "")
	query.Limit = limit
	query.Skip = skip
	query.Sort = sort
	query.TimeStart = timeStart
	query.TimeEnd = timeEnd
	query.Location = location
	if search != "" {
		query.Search = search
	}
	return query, nil
}

func GetBodyParams(c *gin.Context, data interface{}) error {
	body, err := c.GetRawData()
	if err != nil {
		return err
	}
	if err = json.Unmarshal(body, &data); err != nil {
		return err
	}

	if err := validate.Struct(data); err != nil {
		return err
	}

	return nil
}

func EncodeToken(user *model.User) (*string, error) {
	claims := &types.Claims{
		Id:               user.Id,
		Username:         user.Username,
		Name:             user.Name,
		RegisteredClaims: jwt.RegisteredClaims{},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := t.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, err
	}
	return &token, err
}

func EncodePassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func GetAuth(c *gin.Context) (result types.Claims) {
	var d types.Auth
	if val, ok := c.Get("auth"); ok && val != nil {
		d, _ = val.(types.Auth)
	}
	// id, err := primitive.ObjectIDFromHex(d.Id)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
	// 	c.Abort()
	// }
	// result.Id = id
	result.Username = d.Username
	result.Name = d.Name
	return result
}
