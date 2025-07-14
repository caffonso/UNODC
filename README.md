# UNODC
<img src="nicfi-logo.png" alt="Leap Image" width="150" style="float: right;"/>
Tree Species AI Classification

This report presents a collaborative initiative developed within the framework of the UNODC's strategic efforts to combat forest crimes. The LEAP Program (Law Enforcement Assistance Programme to Reduce Tropical Deforestation) is a partnership between INTERPOL and several key branches of UNODC, including the Container Control Program (CCP), the Global Program against Money Laundering (GPML), and the Global Maritime Crime Program (GMCP), with support from Norway's International Climate and Forest Initiative (NICFI). 

Through a combination of operational support, investigative training, and interagency cooperation, the program seeks to strengthen the capacities of law enforcement and customs authorities in Latin America and Southeast Asia. The aim is to identify and disrupt illegal timber supply chains, uncover associated financial crimes, and reduce deforestation and biodiversity loss. In Brazil, the program operates across six major ports, and is also active in Colombia and Peru. By promoting cross-sectoral collaboration, LEAP contributes directly to the achievement of the Sustainable Development Goals (SDGs), particularly those related to environmental protection, justice, and institutional effectiveness.


## Bibliotecas Python

# File system and utility tools
import os
import glob
import pickle
import random

# Data manipulation and analysis
import numpy as np
import pandas as pd

# Image processing and visualization
from PIL import Image
import matplotlib.pyplot as plt

# Signal processing and mathematical tools
from scipy import signal

# Deep Learning with TensorFlow/Keras
import tensorflow as tf
from keras import backend as K, metrics, layers
from keras.models import Model, Sequential, load_model
from keras.layers import (
    Input, Dense, Activation, ZeroPadding2D, BatchNormalization,
    Flatten, Conv2D, AveragePooling2D, MaxPooling2D, Dropout,
    GlobalMaxPooling2D, GlobalAveragePooling2D, Concatenate
)
from keras.preprocessing import image
from keras.utils import layer_utils
from keras.utils.data_utils import get_file
from keras.applications.imagenet_utils import preprocess_input
from keras.utils.vis_utils import model_to_dot
# from keras.utils import plot_model  # Uncomment if needed

# Performance evaluation
from sklearn.metrics import confusion_matrix
