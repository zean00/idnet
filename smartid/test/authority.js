const Identity = artifacts.require("Identity");
const Authority = artifacts.require("Authority");
const CentralAuthority = artifacts.require("CentralAuthority");

contract('Authority', function(accounts) {

  it("should assert true", function(done) {
    var auth = Authority.deployed()
    assert.isTrue(true);
    done();
  });
  
  it("[create identity] should create identity through Authority", function() {
    var central, auth, idAddress, id, gid;
    return CentralAuthority.new()
    .then(function(instance) {
      central = instance;
      return Authority.new()
    })
    .then(function(instance) {
      auth = instance;
      return Identity.deployed()
    })
    .then(function(instance){
      gid = instance;
      return central.RegisterAuthority(auth.address);
    })
    .then(function(){
      return auth.SetCentral(central.address);
    })
    .then(function(){
      return central.IsAuthorized(auth.address);
    })
    .then(function(res){
      assert.equal(res.valueOf(), true, "should be true");
      return gid.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return auth.CreateIdentity('1234567890', r.valueOf());
    })
    .then(function(){
      return auth.GetIdentityAddress('1234567890');
    })
    .then(function(res) {
      idAddress = res.valueOf();
      return gid.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan')
    })
    .then(function(r){
      return auth.UpdateAddress(idAddress, r.valueOf(), auth.address)
    })
    .then(function(){
      return gid.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r) {
      return auth.UpdateAdditionalData(idAddress, r.valueOf())
    })
    .then(function(){
      return Identity.at(idAddress)
    })
    .then(function(instance) {
      id = instance;
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
      return id.CheckAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return central.GetLocation('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), auth.address)
    })
    
  });

  
  it("[create identity] should move identity to another Authority", function() {
    var central, auth, auth2 ,idAddress, id, gid;
    return CentralAuthority.new()
    .then(function(instance) {
      central = instance;
      return Authority.new()
    })
    .then(function(instance) {
      auth = instance;
      return Identity.deployed();
    })
    .then(function(instance){
      gid = instance;
      return central.RegisterAuthority(auth.address);
    })
    .then(function(){
      return auth.SetCentral(central.address);
    })
    .then(function(){
      return central.IsAuthorized(auth.address);
    })
    .then(function(res){
      assert.equal(res.valueOf(), true, "should be true");
      return Authority.new();
    })
    .then(function(instance){
      auth2 = instance;
      return central.RegisterAuthority(auth2.address);
    })
    .then(function(){
      return auth2.SetCentral(central.address);
    })
    .then(function(){
      return central.IsAuthorized(auth2.address);
    })
    .then(function(res){
      assert.equal(res.valueOf(), true, "should be true");
      return gid.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return auth.CreateIdentity('1234567890', r.valueOf());
    })
    .then(function(){
      return auth.GetIdentityAddress('1234567890');
    })
    .then(function(res) {
      idAddress = res.valueOf();
      return gid.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan')
    })
    .then(function(r){
      return auth.UpdateAddress(idAddress, r.valueOf(), auth.address)
    })
    .then(function(){
      return gid.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r) {
      return auth.UpdateAdditionalData(idAddress, r.valueOf())
    })
    .then(function(){
      return Identity.at(idAddress)
    })
    .then(function(instance) {
      id = instance;
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
      return id.CheckAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return central.GetLocation('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), auth.address)
      return gid.HashAddress('kampung', '010/-', 'kelurahan', 'kecamatan')
    })
    .then(function(r){
      return auth.UpdateAddress(idAddress, r.valueOf() , auth2.address)
    })
    .then(function(r){
      return id.CheckAddress('kampung', '010/-', 'kelurahan', 'kecamatan');
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return central.GetLocation('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), auth2.address)
    })

  });

  
  it("[create identity] should delete identity through Authority", function() {
    var central, auth, idAddress, id, gid;
    return CentralAuthority.new()
    .then(function(instance) {
      central = instance;
      return Authority.new()
    })
    .then(function(instance) {
      auth = instance;
      return Identity.deployed();
    })
    .then(function(instance){
      gid = instance;
      return central.RegisterAuthority(auth.address);
    })
    .then(function(){
      return auth.SetCentral(central.address);
    })
    .then(function(){
      return central.IsAuthorized(auth.address);
    })
    .then(function(res){
      assert.equal(res.valueOf(), true, "should be true");
      return gid.HashPrimaryData('sahal zain', 'yogyakarta', '01-01-1990')
    })
    .then(function(r){
      return auth.CreateIdentity('1234567890', r.valueOf());
    })
    .then(function(){
      return auth.GetIdentityAddress('1234567890');
    })
    .then(function(res) {
      idAddress = res.valueOf();
      return gid.HashAddress('perumahan', '001/-', 'kelurahan', 'kecamatan')
    })
    .then(function(r){
      return auth.UpdateAddress(idAddress, r.valueOf(), auth.address)
    })
    .then(function(){
      return gid.HashAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r) {
      return auth.UpdateAdditionalData(idAddress, r.valueOf())
    })
    .then(function(){
      return Identity.at(idAddress)
    })
    .then(function(instance) {
      id = instance;
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
      return id.CheckAdditionalData('islam', 'single', 'developer', 'wni', '-', '31-12-2020')
    })
    .then(function(r){
      assert.equal(r.valueOf(), true, "should be true");
      return central.GetLocation('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), auth.address, "Should be same")
      return auth.RemoveIdentity('1234567890')
    })
    .then(function(r){
      return id.CheckID('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), false, "should be false");
      return auth.GetIdentityAddress('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), '0x0000000000000000000000000000000000000000', "Should be zero address")
      return central.GetLocation('1234567890')
    })
    .then(function(r){
      assert.equal(r.valueOf(), '0x0000000000000000000000000000000000000000', "Should be zero address")
    })
    
  });
  
});
