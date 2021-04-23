.PHONY: grpc_proto

all: grpc_proto


grpc_proto:
	@echo "--> Generating Python Proto example files"
	python3 -m grpc_tools.protoc -I proto/ --python_out=. --grpc_python_out=. proto/video_streaming.proto
	@echo ""
