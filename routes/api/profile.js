const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const checkprofinput = require("../../validator/profile");
const validateExperienceInput = require("../../validator/experience");
const validateEducationInput = require("../../validator/education");

router.get("/test", (req, res) => res.json({ msg: "Success" }));
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
);
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "There are no profiles" }));
});
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = checkprofinput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const ProfileFields = {};
    ProfileFields.user = req.user.id;
    if (req.body.handle) ProfileFields.handle = req.body.handle;
    if (req.body.company) ProfileFields.company = req.body.company;
    if (req.body.website) ProfileFields.website = req.body.website;
    if (req.body.location) ProfileFields.location = req.body.location;
    if (req.body.bio) ProfileFields.bio = req.body.bio;
    if (req.body.status) ProfileFields.status = req.body.status;
    if (req.body.githubusername)
      ProfileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined")
      ProfileFields.skills = req.body.skills.split(",");
    ProfileFields.social = {};
    if (req.body.youtube) ProfileFields.social.youtube = req.body.youtube;
    if (req.body.instagram) ProfileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) ProfileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) ProfileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) ProfileFields.social.facebook = req.body.facebook;
    Profile.findOne({ handle: ProfileFields.handle }).then((profile) => {
      if (profile) {
        errors.handle = "Handle already exists";
        return res.status(400).json(errors);
      }
    });
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: ProfileFields },
            { new: true }
          ).then((profile) => res.json(profile));
        } else {
          new Profile(ProfileFields)
            .save()
            .then((p) => res.json(p))
            .catch((err) => {
              return res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        return res.json(err);
      });
  }
);

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };

        // Add to exp array
        profile.experience.unshift(newExp);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);
        if (removeIndex === -1)
          return res.status(404).json({ msg: "experience not found" });
        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);
        if (removeIndex === -1)
          return res.status(404).json({ msg: "education not found" });
        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;
