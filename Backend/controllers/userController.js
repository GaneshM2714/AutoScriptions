const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const register_user = async (req, res) => {
  try {
    const { username, email, phone, account, password } = req.body;

    const existingUser = await user.findOne({
      $or: [{ phone }, { account }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    } else {
      const pass = await bcrypt.hash(password, 10);

      const newuser = await user.create({
        username,
        emailid: email,
        phone,
        account,
        password: pass,
      });

      return res.status(201).json({
        success: true,
        message: "User has been created successfully.",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or account number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login_user = async (req, res) => {
  const { phone, password } = req.body;

  const getuser = await user.findOne({
    phone,
  });

  if (!getuser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const actualpass = getuser.password;
  const matches = await bcrypt.compare(password, actualpass);

  if (matches) {
    const token = jwt.sign(
      {
        id: getuser._id,
        phone: phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      token: token,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Log in failed. Invalid password entered.",
    });
  }
};

const logout_user = async (req, res) => {
  try {
      // For client-side logout, the backend just confirms the request
      return res.status(200).json({
          success: true,
          message: "Logged out successfully"
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Error during logout"
      });
  }
};

const profile = async (req, res) => {
  try {
      // Get user ID from JWT middleware (req.user is set by authenticateToken)
      const userId = req.user.id;
      
      // Find user by ID, excluding sensitive information like password
      const User = await user.findById(userId).select('-password');

      if (!User) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      return res.status(200).json({
          success: true,
          user: {
              _id: User._id,
              username: User.username,
              email: User.emailid, 
              phone: User.phone,
              account: User.account,
              createdAt: User.createdAt,
              updatedAt: User.updatedAt
          }
      });

  } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({
          success: false,
          message: "Internal server error while fetching profile"
      });
  }
};

const getPreferences = async (req, res) => {
  try {
      const userId = req.user.id;

      const foundUser = await user.findById(userId).select('preferences');

      if (!foundUser) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      const defaultPreferences = {
          notifications: {
              emailNotifications: true,
              pushNotifications: false,
              renewalReminders: true,
              weeklyReports: false,
              reminderDays: 7
          },
          display: {
              darkMode: false,
              currency: 'USD',
              dateFormat: 'MM/DD/YYYY',
              language: 'en'
          },
          privacy: {
              dataSharing: false,
              analyticsTracking: true,
              marketingEmails: false
          },
          subscriptions: {
              defaultCategory: '',
              autoSync: true,
              duplicateDetection: true,
              trialReminders: true
          }
      };

      // Check if preferences object is empty or lacks required structure
      const hasValidPreferences = foundUser.preferences && 
                                 Object.keys(foundUser.preferences).length > 0 &&
                                 foundUser.preferences.notifications &&
                                 foundUser.preferences.display &&
                                 foundUser.preferences.privacy &&
                                 foundUser.preferences.subscriptions;

      return res.status(200).json({
          success: true,
          preferences: hasValidPreferences ? foundUser.preferences : defaultPreferences
      });

  } catch (error) {
      console.error('Error fetching preferences:', error);
      return res.status(500).json({
          success: false,
          message: "Error fetching preferences"
      });
  }
};


const updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { preferences } = req.body;

        if (!preferences) {
            return res.status(400).json({
                success: false,
                message: "Preferences data is required"
            });
        }

        // Validate preferences structure (optional)
        const requiredSections = ['notifications', 'display', 'privacy', 'subscriptions'];
        const hasValidStructure = requiredSections.every(section => 
            preferences.hasOwnProperty(section)
        );

        if (!hasValidStructure) {
            return res.status(400).json({
                success: false,
                message: "Invalid preferences structure"
            });
        }

        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { 
                preferences: preferences,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('preferences');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preferences updated successfully",
            preferences: updatedUser.preferences
        });

    } catch (error) {
        console.error('Error updating preferences:', error);
        return res.status(500).json({
            success: false,
            message: "Error updating preferences"
        });
    }
};


module.exports = { register_user, login_user ,logout_user, profile, getPreferences , updatePreferences};
