const Identity = artifacts.require("Identity");

contract('Identity', function(accounts) {

  it("should assert true", function(done) {
    var id = Identity.deployed()
    assert.isTrue(true);
    done();
  });
  
  it("[create identity] should create identity", function() {
    var id;
    return Identity.new()
    .then(function(instance) {
      id = instance;
      return id.HashID('1234567890')
    })
    .then(function(r){
      return id.SetIDHash(r.valueOf())
    })
    .then(function(){
      return id.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return id.SetPrimaryHash(r.valueOf())
    })
    .then(function(){
      return id.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan');
    })
    .then(function(r) {
      return id.SetAddressHash(r.valueOf())
    })
    .then(function() {
      return id.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', 'pria', '31-12-2020')
    })
    .then(function(r) {
      return id.SetAdditionalHash(r.valueOf())
    })
    .then(function() {
      return id.CheckID('1234567890');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckPrimaryData('sahal zain', 'yogyakarta', '01-01-1990');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckAddress('perumahan', '001/-', 'kelurahan', 'kecamatan');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckAdditionalData('islam', 'single', 'developer', 'wni', '-', 'pria', '31-12-2020')
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
    })
  });

  
  it("[create identity] should update identity", function() {
    var id;
    return Identity.new()
    .then(function(instance) {
      id = instance;
      return id.HashID('1234567890')
    })
    .then(function(r){
      return id.SetIDHash(r.valueOf())
    })
    .then(function(){
      return id.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return id.SetPrimaryHash(r.valueOf())
    })
    .then(function(){
      return id.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan');
    })
    .then(function(r) {
      return id.SetAddressHash(r.valueOf())
    })
    .then(function() {
      return id.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', 'pria', '31-12-2020')
    })
    .then(function(r) {
      return id.SetAdditionalHash(r.valueOf())
    })
    .then(function(){
      return id.HashID('0987654321')
    })
    .then(function(r){
      return id.SetIDHash(r.valueOf())
    })
    .then(function(){
      return id.HashPrimaryData('sahal arafat zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r) {
      return id.SetPrimaryHash(r.valueOf())
    })
    .then(function(){
      return id.HashAddress('perumahan', '001/001', 'kelurahan', 'kecamatan')
    })
    .then(function(r) {
      return id.SetAddressHash(r.valueOf());
    })
    .then(function(){
      return id.HashAdditionalData('islam', 'single', 'hacker', 'wni', 'o', 'pria','31-12-2020')
    })
    .then(function(r) {
      return id.SetAdditionalHash(r.valueOf())
    })
    .then(function() {
      return id.CheckID('1234567890');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckPrimaryData('sahal zain', 'yogyakarta', '01-01-1990');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckAddress('perumahan', '001/001', 'kelurahan', 'kecamatan');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return id.CheckAdditionalData('islam', 'single', 'hacker', 'wni', 'o', 'pria', '31-12-2020')
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
    })
    
  });

  
  it("[create identity] should deactivate identity", function() {
    var id;
    return Identity.new()
    return Identity.new()
    .then(function(instance) {
      id = instance;
      return id.HashID('1234567890')
    })
    .then(function(r){
      return id.SetIDHash(r.valueOf())
    })
    .then(function(){
      return id.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return id.SetPrimaryHash(r.valueOf())
    })
    .then(function(){
      return id.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan');
    })
    .then(function(r) {
      return id.SetAddressHash(r.valueOf())
    })
    .then(function() {
      return id.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', 'pria', '31-12-2020')
    })
    .then(function(r) {
      return id.SetAdditionalHash(r.valueOf())
    })
    .then(function() {
      return id.Deactivate();
    })
    .then(function() {
      return id.CheckID('1234567890');
    })
    .then(function(r){
      assert.equal(r.valueOf(), false, "should be false");
    })
  });
  
  
});
