const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');

const TOKEN_KEY = process.env;

const registerUser = async (args) => {
  const { email, password, firstName, lastName } = args;

  try {
    const allInputFilled = [ email, password, firstName, lastName ].every(item => item);
    if (!allInputFilled) {
      return { statusCode: 400, message: 'All input required' };
    }

    const userAlreadyExist = await User.findOne({ email: email.toLowerCase() });

    if (userAlreadyExist) {
      return {statusCode: 409, message: 'A user already exist for this email.'};
    }

    const encryptedUserPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      password: encryptedUserPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      TOKEN_KEY,
      {
        expiresIn: '5h'
      }
    );

    user.token = token;
    return {statusCode: 201, data: user};
  } catch (error) {
    console.log('/register error: ', error);
    return { statusCode: 500, message: 'Internal server error.' };
  }
};

const loginUser = async (args) => {
  const { email, password } = args;
  try {
    if (!email || !password ) {
      return { statusCode: 400, message: 'All input fields required' };
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        TOKEN_KEY,
        {
          expiresIn: '5h'
        }
      );

      user.token = token;
      return { statusCode: 200, data: user };
    }
    return { statusCode: 400, message: 'Invalid username or password.'};
    
  } catch (error) {
    console.log('/login error', error);
    return { statusCode: 500, message: 'Internal server error.' };
  }
};

module.exports.AuthService = { registerUser, loginUser };