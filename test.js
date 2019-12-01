var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server');
var should = chai.should();

chai.use(chaiHttp);


describe('ToDo Tasks Crud Apis', function() {
    it('should list ALL tasks on /tasks GET', function(done) {
        chai.request(server)
        .get('/tasks')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });
    });

    it('should add a SINGLE task on /tasks POST', function(done) {
        chai.request(server)
        .post('/tasks')
        .send({'name': 'Java'})
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('_id');
            res.body.should.have.property('active');
            res.body.should.have.property('completed');
            res.body.should.have.property('Created_date');
            res.body.name.should.equal('Java');
            res.body.active.should.equal(1);
            res.body.completed.should.equal(false);
            done();
      });
    });

    it('should update a SINGLE Task on /tasks/<id> PUT', function(done) {
        chai.request(server)
        .get('/tasks')
        .end(function(err, res){
            var documentId = res.body[0]._id;
            var statusToBeUpdated =res.body[0].completed  ? false : true;
            chai.request(server)
            .put('/tasks/'+documentId)
            .send({'completed': statusToBeUpdated})
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('_id');
                response.body.should.have.property('active');
                response.body.should.have.property('completed');
                response.body.should.have.property('Created_date');
                response.body._id.should.equal(documentId);
                response.body.completed.should.equal(statusToBeUpdated);
                done();
            });
        });
    });

    it('should delete a SINGLE task on /tasks/<id> DELETE', function(done) {
        chai.request(server)
        .get('/tasks')
        .end(function(err, res){
            var documentId = res.body[0]._id;
            chai.request(server)
            .delete('/tasks/'+documentId)
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('_id');
                response.body.should.have.property('active');
                response.body.should.have.property('completed');
                response.body.should.have.property('Created_date');
                response.body._id.should.equal(documentId);
                response.body.active.should.equal(0);
                done();
            });
        });
    });
});


/**
 * In Db there are task names of two types
 * Single name Eg:(Nathan)
 * Multiple names Eg:(Nathan,Jayme,Nichole)
 */
describe('Textual Search and Pagination Api test', function() {
    it('should select a keyword and find return all records containing keyword /textualSearch?keyword=<keyword> GET', function(done) {
        chai.request(server)
        .get('/tasks')
        .end(function(err, res){
            var arrLength = res.body.length;
            var min = 0;
            var max = arrLength;
            var selectedDocument = Math.floor(Math.random() * (max - min + 1)) + min;                                                                 // Select Random Document from array 
            var document = res.body[selectedDocument];
            var documentName = document.name.split(", ");
            var keyword = documentName.length > 1 ? documentName[Math.floor(Math.random() * (documentName.length - 1 + 1)) + 1] : documentName[0];    // If the name is of multiple words separated by "," 
            chai.request(server)                                                                                                                      // then random word selection && if its single word than keep it as it is
            .get('/textualSearch?keyword='+keyword)
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                var element = response.body[0].name;
                var result = element.includes(keyword);
                result.should.equal(true);
                done();
            });
        });
    });

    it('Pagination /paginatedTasks?pageNo=<pageNum>&size=<size> GET', function(done) {
        chai.request(server)
        .get('/tasks')
        .end(function(err, res){
            var arrLength = res.body.length;
            var min = 1;
            var max = arrLength;
            var size = Math.floor(Math.random() * (max - min + 1)) + min;               // choosing random num not greater than array length as size
            var numOfPages = Math.ceil(max/size);                                       // estimating how many pages would be their as per the random size choosen
            var pageNum =  Math.floor(Math.random() * (numOfPages - min + 1)) + min;    // choosing random page number
            chai.request(server)
            .get('/paginatedTasks?pageNo='+pageNum+'&size='+size)
            .end(function(error, response){
                skipDocuments = size * (pageNum - 1)                                    // From the complete set of all documents in array from which number of document do we need data
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body[0]._id.should.equal(res.body[skipDocuments]._id);         
                done();
            });
        });
    });
});