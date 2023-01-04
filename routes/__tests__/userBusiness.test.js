//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const userBusinessRoutes = require("../userBusiness");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", userBusinessRoutes);

//----- Routes
app.use(require("../userBusiness"));

describe("----- User-Business Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      // Clear initial data
      const UserBusiness = mongoose.model("UserBusiness");
      return UserBusiness.deleteMany({})
    })
    .then(() => done());
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const UserBusiness = mongoose.model("UserBusiness");
    UserBusiness.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done());
  }, 20000);

  describe("/api/userBusiness", () => {
    //----- Test 1 -----
    it("(POST) successfully creates a user-business", done => {
      // Create user-business
      request(app)
      .post("/api/userBusiness")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        businessId: "000"
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        done();
      });
    });

    //----- Test 2 -----
    it("(GET) successfully retrieves all user-businesses", done => {
      // Create user-business
      request(app)
      .post("/api/userBusiness")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        businessId: "000"
      })
      .end((err, res) => {
        if(err) return done(err);
        // Create 2nd user-business
        request(app)
        .post("/api/userBusiness")
        .send({
          userId: mongoose.Types.ObjectId("100000000000000000000000"),
          businessId: "111"
        })
        .end((err, res) => {
          if(err) return done(err);
          // Retrieve all user-businesses
          request(app)
          .get("/api/userBusiness")
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.userBusinesses).toBeDefined();
            expect(Array.isArray(res.body.userBusinesses)).toBe(true);
            expect(res.body.userBusinesses).toHaveLength(2);
            done();
          });
        });
      });
    });

    //----- Test 3 -----
    it("(DELETE) successfully deletes a user-businesses", done => {
      // Create user-business
      request(app)
      .post("/api/userBusiness")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        businessId: "000"
      })
      .end((err, res) => {
        if(err) return done(err);
        // Delete user-business
        request(app)
        .delete("/api/userBusiness")
        .send({
          userId: mongoose.Types.ObjectId("100000000000000000000000"),
          businessId: "000"
        })
        .end((err, res) => {
          if(err) return done(err);
          // Retrieve all user-businesses
          request(app)
          .get("/api/userBusiness")
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.userBusinesses).toBeDefined();
            expect(Array.isArray(res.body.userBusinesses)).toBe(true);
            expect(res.body.userBusinesses).toHaveLength(0);
            done();
          });
        });
      });
    });
  });

  describe("/api/userBusiness/user", () => {
    //----- Test 4 -----
    it("(POST) successfully retrieve all user-businesses for user", done => {
      // Create user-business
      request(app)
      .post("/api/userBusiness")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        businessId: "000"
      })
      .end((err, res) => {
        if(err) return done(err);
        // Create 2nd user-business
        request(app)
        .post("/api/userBusiness")
        .send({
          userId: mongoose.Types.ObjectId("200000000000000000000000"),
          businessId: "111"
        })
        .end((err, res) => {
          if(err) return done(err);
          // Retrieve all user-businesses for user
          request(app)
          .post("/api/userBusiness/user")
          .send({
            userId: mongoose.Types.ObjectId("100000000000000000000000")
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.userBusinesses).toBeDefined();
            expect(Array.isArray(res.body.userBusinesses)).toBe(true);
            expect(res.body.userBusinesses).toHaveLength(1);
            done();
          });
        });
      });
    });

    //----- Test 5 -----
    it("(DELETE) successfully delete all user-businesses for user", done => {
      // Create user-business
      request(app)
      .post("/api/userBusiness")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        businessId: "000"
      })
      .end((err, res) => {
        if(err) return done(err);
        // Create 2nd user-business
        request(app)
        .post("/api/userBusiness")
        .send({
          userId: mongoose.Types.ObjectId("100000000000000000000000"),
          businessId: "111"
        })
        .end((err, res) => {
          if(err) return done(err);
          // Delete all user-businesses for user
          request(app)
          .delete("/api/userBusiness/user")
          .send({
            userId: mongoose.Types.ObjectId("100000000000000000000000")
          })
          .end((err, res) => {
            if(err) return done(err);
            // Retrieve all user-businesses for user
            request(app)
            .post("/api/userBusiness/user")
            .send({
              userId: mongoose.Types.ObjectId("100000000000000000000000")
            })
            .end((err, res) => {
              if(err) return done(err);
              expect(res.statusCode).toBe(200);
              expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
              expect(res.body.success).toBeDefined();
              expect(res.body.success).toBe(true);
              expect(res.body.userBusinesses).toBeDefined();
              expect(Array.isArray(res.body.userBusinesses)).toBe(true);
              expect(res.body.userBusinesses).toHaveLength(0);
              done();
            });
          });
        });
      });
    });
  });
});