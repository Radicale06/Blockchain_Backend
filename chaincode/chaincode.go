package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// FileTrack provides functions for managing file tracking
type FileTrack struct {
	contractapi.Contract
}

// File describes basic details of what makes up a file
type File struct {
	ID        string    `json:"ID"`
	Hash      string    `json:"hash"`
	Name      string    `json:"name"`
	Owner     string    `json:"owner"`
	Timestamp time.Time `json:"timestamp"`
	Status    string    `json:"status"`
}

// FileHistory describes the file history details
type FileHistory struct {
	TxId      string    `json:"txId"`
	Hash      string    `json:"hash"`
	Timestamp time.Time `json:"timestamp"`
	Owner     string    `json:"owner"`
	Status    string    `json:"status"`
}

// InitLedger adds a base set of files to the ledger
func (s *FileTrack) InitLedger(ctx contractapi.TransactionContextInterface) error {
	files := []File{
		{
			ID:        "file1",
			Hash:      "hash1",
			Name:      "document1.pdf",
			Owner:     "user1",
			Timestamp: time.Now(),
			Status:    "ACTIVE",
		},
	}

	for _, file := range files {
		fileJSON, err := json.Marshal(file)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(file.ID, fileJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state: %v", err)
		}
	}

	return nil
}

// CreateFile adds a new file to the world state with given details
func (s *FileTrack) CreateFile(ctx contractapi.TransactionContextInterface, id string, hash string, name string, owner string) error {
	exists, err := s.FileExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the file %s already exists", id)
	}

	file := File{
		ID:        id,
		Hash:      hash,
		Name:      name,
		Owner:     owner,
		Timestamp: time.Now(),
		Status:    "ACTIVE",
	}

	fileJSON, err := json.Marshal(file)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, fileJSON)
}

// QueryFile returns the file stored in the world state with given id
func (s *FileTrack) QueryFile(ctx contractapi.TransactionContextInterface, id string) (*File, error) {
	fileJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if fileJSON == nil {
		return nil, fmt.Errorf("the file %s does not exist", id)
	}

	var file File
	err = json.Unmarshal(fileJSON, &file)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// UpdateFileHash updates an existing file hash in the world state
func (s *FileTrack) UpdateFileHash(ctx contractapi.TransactionContextInterface, id string, newHash string) error {
	file, err := s.QueryFile(ctx, id)
	if err != nil {
		return err
	}

	file.Hash = newHash
	file.Timestamp = time.Now()

	fileJSON, err := json.Marshal(file)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, fileJSON)
}

// GetFileHistory returns the history of a file
func (s *FileTrack) GetFileHistory(ctx contractapi.TransactionContextInterface, id string) ([]FileHistory, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var history []FileHistory
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var file File
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &file)
			if err != nil {
				return nil, err
			}
		}

		record := FileHistory{
			TxId:      response.TxId,
			Hash:      file.Hash,
			Timestamp: file.Timestamp,
			Owner:     file.Owner,
			Status:    file.Status,
		}
		history = append(history, record)
	}

	return history, nil
}

// FileExists returns true when file with given ID exists in world state
func (s *FileTrack) FileExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	fileJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return fileJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&FileTrack{})
	if err != nil {
		fmt.Printf("Error creating FileTrack chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting FileTrack chaincode: %s", err.Error())
	}
}
